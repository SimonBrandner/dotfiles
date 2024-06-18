return {
	"folke/which-key.nvim",
	event = "VeryLazy",
	init = function()
		vim.o.timeout = true
		vim.o.timeoutlen = 300
	end,
	opts = {},
	config = function ()
		local which_key = require("which-key")

		which_key.register(
			{
				w = {
					name = "Window",
					s = {
						name = "Split",
						v = {
							name = "Vertical"
						},
						h = {
							name = "Horizontal"
						}
					},
					q = {
						name = "Quit"
					},
					h = {
						name = "Left"
					},
					j = {
						name = "Down"
					},
					k = {
						name = "Up"
					},
					l = {
						name = "Right"
					},
					r = {
						name = "Resize"
					}
				},
				l = {
					name = "Language server",
					a = {
						name = "Actions"
					},
					d = {
						name = "Definition"
					},
					u = {
						name = "Usage"
					},
					r = {
						name = "Rename"
					}
				},
				b = {
					name = "Buffer",
					w = {
						name = "Write"
					},
					h = {
						name = "Previous"
					},
					l = {
						name = "Next"
					},
					q = {
						name = "Quit"
					},
					f = {
						name = "Find"
					}
				},
				g = {
					name = "GIT"
				},
				q = {
					name = "Quit"
				},
				t = {
					name = "Terminal"
				}
			},
			{
				prefix = "<leader>"
			}
		)
	end
}
