return {
	'akinsho/toggleterm.nvim',
	version = "*",
	config = function ()
		require("toggleterm").setup({
			direction = "horizontal",
			size = 5,
		})
	end
}
