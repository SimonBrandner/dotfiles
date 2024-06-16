return {
	'dimfred/resize-mode.nvim',
	config = function ()
		local resize_mode = require("resize-mode")

		resize_mode.setup({
			horizontal_amount = 1,
			vertical_amount = 1,
			hooks = {
				on_enter = function ()
					vim.g.customModeName = "RESIZE"
				end,
				on_leave = function ()
					vim.g.customModeName = nil
				end
			}
		})
	end
}
