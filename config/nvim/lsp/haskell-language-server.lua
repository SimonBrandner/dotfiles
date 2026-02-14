return {
	cmd = { "haskell-language-server-wrapper", "--lsp" },
	filetypes = { "haskell", "lhaskell", "cabal" },
	settings = {
		haskell = {
			formattingProvider = "ormolu",
		},
	},
}
