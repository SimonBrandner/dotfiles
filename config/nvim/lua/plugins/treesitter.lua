return {
	"nvim-treesitter/nvim-treesitter",
	build = ":TSUpdate",
	config = function ()
		local config = require("nvim-treesitter.configs")
		config.setup({
			ensure_installed = {
				"lua",
				"vim",
				"vimdoc",
				"javascript",
				"html",
				"rust",
				"typescript",
			},
			highlight = { enable = true },
			indent = { enable = true },
		})
	end
}
