return {
	"lukas-reineke/indent-blankline.nvim",
	main = "ibl",
	config = function()
		require("ibl").setup({
			scope = {
				enabled = true,
				highlight = { "Function", "Label" },
				show_start = false,
				show_end = false,
			},
			indent = {
				char = "▏",
			},
		})
	end,
}
