return {
	"olimorris/onedarkpro.nvim",
	name = "onedarkpro",
	priority = 1000,
	config = function()
		require("onedarkpro").setup({
			options = {
				cursorline = true,
				transparency = true,
			},
		})
		vim.cmd("colorscheme onedark")
	end,
}
