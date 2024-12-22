#!/usr/bin/env zsh

# ags -r "unlockScreen()"
pkill --signal SIGUSR1 swaylock
