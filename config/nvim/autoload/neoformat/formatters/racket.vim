function! neoformat#formatters#racket#enabled() abort
	return ['racketfmt']
endfunction

function! neoformat#formatters#racket#racketfmt() abort
	return {
		\ 'exe': 'raco',
		\ 'args': ['fmt'],
		\ 'stdin': 1
		\ }
endfunction
