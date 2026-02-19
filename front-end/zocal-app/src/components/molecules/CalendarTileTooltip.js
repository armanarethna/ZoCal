import React from 'react';
import { 
  Tooltip, 
  Typography, 
  Box, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { format } from 'date-fns';
import { 
  ROJ_NAMES, 
  MAH_NAMES, 
  GATHA_NAMES,
  ROJ_MEANINGS, 
  MAH_MEANINGS, 
  GATHA_MEANINGS
} from '../../constants';

const CalendarTileTooltip = ({ 
  children, 
  date, 
  zoroastrianDate, 
  specialDateInfo,
  dayType,
  open, 
  onClose 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const formatDate = (date) => {
    return format(date, 'dd MMM yyyy');
  };
  
  const getTooltipContent = () => {
    const formattedDate = formatDate(date);
    
    if (zoroastrianDate.isGatha) {
      // For Gatha days
      const gathaIndex = GATHA_NAMES.indexOf(zoroastrianDate.roj);
      const gathaDescription = gathaIndex !== -1 ? GATHA_MEANINGS[gathaIndex] : '';
      
      return (
        <Box sx={{ p: 1, maxWidth: 280 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Date: {formattedDate}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Zoroastrian Details:
          </Typography>
          <Typography variant="body2">
            Gatha: {zoroastrianDate.roj} ({gathaDescription})
          </Typography>
        </Box>
      );
    } else {
      // For regular days
      const rojIndex = ROJ_NAMES.indexOf(zoroastrianDate.roj);
      const mahIndex = MAH_NAMES.indexOf(zoroastrianDate.mah);
      
      const rojMeaning = rojIndex !== -1 ? ROJ_MEANINGS[rojIndex] : '';
      const mahMeaning = mahIndex !== -1 ? MAH_MEANINGS[mahIndex] : '';
      
      return (
        <Box sx={{ p: 1, maxWidth: 280 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Date: {formattedDate}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Zoroastrian Details:
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Roj: {zoroastrianDate.roj} ({rojMeaning})
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Mah: {zoroastrianDate.mah} ({mahMeaning})
          </Typography>
          
          {/* Special Date Information */}
          {(specialDateInfo || dayType === 'Muktad') && (
            <>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, mt: 1 }}>
                Special Date:
              </Typography>
              {dayType === 'Muktad' ? (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Muktad
                </Typography>
              ) : specialDateInfo && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {specialDateInfo.description 
                    ? `${specialDateInfo.name}: ${specialDateInfo.description}`
                    : specialDateInfo.name
                  }
                </Typography>
              )}
            </>
          )}
        </Box>
      );
    }
  };

  // Use same pattern as RojCalculatorTab - single Tooltip with controlled behavior
  return (
    <Tooltip
      title={getTooltipContent()}
      arrow
      placement="top"
      open={isMobile ? open : undefined}
      onClose={onClose}
      disableHoverListener={isMobile}
      disableFocusListener={isMobile}
      disableTouchListener={isMobile}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: 1,
            borderColor: theme.palette.divider,
            boxShadow: theme.shadows[8],
            '& .MuiTooltip-arrow': {
              color: theme.palette.background.paper,
              '&:before': {
                border: 1,
                borderColor: theme.palette.divider,
              }
            }
          }
        },
        popper: {
          sx: {
            '&[data-popper-placement*="top"] .MuiTooltip-tooltip': {
              marginBottom: '-4px !important'
            }
          }
        }
      }}
    >
      {children}
    </Tooltip>
  );
};

export default CalendarTileTooltip;