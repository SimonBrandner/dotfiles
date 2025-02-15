export SYSTEMD_EDITOR="/bin/micro" 

PERL5LIB="/home/simon/perl5/lib/perl5${PERL5LIB:+:${PERL5LIB}}"; export PERL5LIB;
PERL_LOCAL_LIB_ROOT="/home/simon/perl5${PERL_LOCAL_LIB_ROOT:+:${PERL_LOCAL_LIB_ROOT}}"; export PERL_LOCAL_LIB_ROOT;
PERL_MB_OPT="--install_base \"/home/simon/perl5\""; export PERL_MB_OPT;
PERL_MM_OPT="INSTALL_BASE=/home/simon/perl5"; export PERL_MM_OPT;
PATH="/home/simon/perl5/bin${PATH:+:${PATH}}"; export PATH;
PATH="/home/simon/.local/bin${PATH:+:${PATH}}"; export PATH;

eval "$(direnv hook zsh)"
