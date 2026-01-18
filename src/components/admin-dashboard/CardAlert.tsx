"use client";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Sparkles } from 'lucide-react';
import ButtonCom from '@/components/Button';
import type { CardAlertConfig } from './types';

const ICON_SIZE = 16;
const CARD_MARGIN = 1.5;
const TYPOGRAPHY_MARGIN_BOTTOM = 2;
const DEFAULT_TITLE = 'Plan about to expire';
const DEFAULT_DESCRIPTION = 'Enjoy 10% off when renewing your plan today.';
const DEFAULT_BUTTON_TEXT = 'Get the discount';

const getCardStyles = () => ({
  margin: CARD_MARGIN,
  flexShrink: 0,
});

const getTitleStyles = () => ({
  fontWeight: 600,
});

const getDescriptionStyles = () => ({
  marginBottom: TYPOGRAPHY_MARGIN_BOTTOM,
  color: 'text.secondary',
});

const CardAlert = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  buttonText = DEFAULT_BUTTON_TEXT,
  onButtonClick,
}: CardAlertConfig) => {
  return (
    <Card variant="outlined" sx={getCardStyles()}>
      <CardContent>
        <Sparkles size={ICON_SIZE} className="mb-2" />
        <Typography gutterBottom sx={getTitleStyles()}>
          {title}
        </Typography>
        <Typography variant="body2" sx={getDescriptionStyles()}>
          {description}
        </Typography>
        <ButtonCom
          text={buttonText}
          type="primary"
          onClick={onButtonClick}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
};

export default CardAlert;