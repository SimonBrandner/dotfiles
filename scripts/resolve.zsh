#!/usr/bin/zsh

qdbus org.kde.kded5 /kded org.kde.kded5.unloadModule "appmenu" && /opt/resolve/bin/resolve & sleep 5 && qdbus org.kde.kded5 /kded org.kde.kded5.loadModule "appmenu" & disown $!
