return {
	'dimfred/resize-mode.nvim',
	config = function ()
		local resize_mode = require("resize-mode")

		resize_mode.setup({
			horizontal_amount = 1,
			vertical_amount = 1,
		})
	end
}
