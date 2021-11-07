#!/usr/bin/bash

OPTIONS="Reboot\nPower-off\nLog-out"

# source configuration or use default values
if [ -f $HOME/.config/rofi-power/config ]; then
  source $HOME/.config/rofi-power/config
else
    LAUNCHER="rofi -opacity 10 -config /home/simon/.config/rofi/power.rasi -dmenu -i -p Power: "
  USE_LOCKER="false"
  LOCKER="i3lock"
fi

# Show exit wm option if exit command is provided as an argument
if [ ${#1} -gt 0 ]; then
  OPTIONS="Exit window manager\n$OPTIONS"
fi

option=`echo -e $OPTIONS | $LAUNCHER | awk '{print $1}' | tr -d '\r\n'`
if [ ${#option} -gt 0 ]
then
    case $option in
      Exit)
        eval $1
        ;;
      Reboot)
        systemctl reboot
        ;;
      Power-off)
        systemctl poweroff
        ;;
      Log-out)
        qdbus org.kde.ksmserver /KSMServer logout 0 3 3
        ;;
      *)
        ;;
    esac
fi
