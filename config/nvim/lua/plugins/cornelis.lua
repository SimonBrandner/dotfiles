return {
	"isovector/cornelis",
	name = "cornelis",
	ft = "agda",
	build = "stack install",
	dependencies = { "neovimhaskell/nvim-hs.vim", "kana/vim-textobj-user" },
	tag = "v2.7.1",
	version = "*",
	config = function()
		vim.g.cornelis_split_location = "bottom"
	end,
}
