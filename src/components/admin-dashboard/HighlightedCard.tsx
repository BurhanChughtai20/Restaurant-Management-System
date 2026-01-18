"use client";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ChevronRight, TrendingUp } from 'lucide-react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ButtonCom from '@/components/Button';
import type { HighlightedCardConfig } from './types';

const ICON_SIZE = 24;
const BUTTON_ICON_SIZE = 16;
const DESCRIPTION_MARGIN_BOTTOM = '8px';
const DEFAULT_TITLE = 'Explore your data';
const DEFAULT_DESCRIPTION = 'Uncover performance and visitor insights with our data wizardry.';
const DEFAULT_BUTTON_TEXT = 'Get insights';
const SMALL_SCREEN_BREAKPOINT = 'sm';

const getTitleStyles = () => ({
  fontWeight: '600',
});

const getDescriptionStyles = () => ({
  color: 'text.secondary',
  marginBottom: DESCRIPTION_MARGIN_BOTTOM,
});

const getButtonClassName = (isSmallScreen: boolean) => {
  return isSmallScreen ? 'w-full' : '';
};

const HighlightedCard = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  buttonText = DEFAULT_BUTTON_TEXT,
  onButtonClick,
}: HighlightedCardConfig) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(SMALL_SCREEN_BREAKPOINT));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <TrendingUp size={ICON_SIZE} className="mb-2" />
        <Typography component="h2" variant="subtitle2" gutterBottom sx={getTitleStyles()}>
          {title}
        </Typography>
        <Typography sx={getDescriptionStyles()}>
          {description}
        </Typography>
        <ButtonCom
          text={buttonText}
          type="primary"
          icon={<ChevronRight size={BUTTON_ICON_SIZE} />}
          iconPosition="right"
          onClick={onButtonClick}
          className={getButtonClassName(isSmallScreen)}
        />
      </CardContent>
    </Card>
  );
};

export default HighlightedCard;