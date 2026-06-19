return {
	"nvim-treesitter/nvim-treesitter",
	dependencies = { "neovim-treesitter/treesitter-parser-registry" },
	lazy = false,
	build = ":TSUpdate",
	config = function()
		vim.api.nvim_create_autocmd("FileType", {
			pattern = {
				"rust",
				"c",
				"cpp",
				"python",
				"typescript",
				"lua",
				"vim",
				"vimdoc",
				"javascript",
				"html",
				"haskell",
				"racket",
				"yaml",
				"nix",
				"markdown",
				"typst",
			},
			callback = function()
				vim.treesitter.start()
				vim.bo.indentexpr = "v:lua.require'nvim-treesitter'.indentexpr()"
			end,
		})
	end,
}
