return {
	"folke/which-key.nvim",
	event = "VeryLazy",
	init = function()
		vim.o.timeout = true
		vim.o.timeoutlen = 300
	end,
	opts = {},
	config = function()
		local which_key = require("which-key")

		which_key.register({
			w = {
				name = "Window",
				s = {
					name = "Split",
					v = {
						name = "Vertical",
					},
					h = {
						name = "Horizontal",
					},
				},
				q = {
					name = "Quit",
				},
				h = {
					name = "Left",
				},
				j = {
					name = "Down",
				},
				k = {
					name = "Up",
				},
				l = {
					name = "Right",
				},
				r = {
					name = "Resize",
				},
				R = {
					name = "Reverse",
				},
			},
			l = {
				name = "Language server",
				a = {
					name = "Actions",
				},
				d = {
					name = "Definition",
				},
				u = {
					name = "Usage",
				},
				r = {
					name = "Rename",
				},
				p = {
					name = "Problems",
				},
			},
			g = {
				name = "GIT",
			},
			q = {
				name = "Quit",
			},
			t = {
				name = "Terminal",
			},
			T = {
				name = "Text",
				t = {
					name = "Retab",
				},
				s = {
					name = "Substitute",
				},
			},
			s = {
				name = "Search",
				f = {
					name = "File",
				},
				c = {
					name = "Clear",
				},
				w = {
					name = "Workspace",
				},
				b = {
					name = "Buffer",
				},
				g = {
					name = "Global",
				},
				s = {
					name = "Sessions",
				},
			},
		}, {
			prefix = "<leader>",
		})
	end,
}
