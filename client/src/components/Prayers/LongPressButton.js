import React from "react";
import { Button } from "react-bootstrap";
import { useLongPress } from "use-long-press";

const LongPressButton = ({
  btnText,
  onLongPress,
  longPressThreshold: threshold,
  ...btnProps
}) => {
  const bind = useLongPress(
    () => {
      onLongPress();
    },
    { threshold }
  );

  return (
    <Button {...btnProps} {...bind()}>
      {btnText}
    </Button>
  );
};

export default LongPressButton;
