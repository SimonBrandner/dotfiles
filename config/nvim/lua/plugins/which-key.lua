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

		which_key.add({
			{ "<leader>T", group = "Text" },
			{ "<leader>Ts", group = "Substitute" },
			{ "<leader>Tt", group = "Retab" },
			{ "<leader>g", group = "GIT" },
			{ "<leader>l", group = "Language server" },
			{ "<leader>la", group = "Actions" },
			{ "<leader>ld", group = "Definition" },
			{ "<leader>lh", group = "Help" },
			{ "<leader>lp", group = "Problems" },
			{ "<leader>lr", group = "Rename" },
			{ "<leader>lu", group = "Usage" },
			{ "<leader>q", group = "Quit" },
			{ "<leader>s", group = "Search" },
			{ "<leader>sa", group = "All files" },
			{ "<leader>sb", group = "Buffers" },
			{ "<leader>sc", group = "Clear" },
			{ "<leader>sf", group = "File" },
			{ "<leader>ss", group = "Sessions" },
			{ "<leader>t", group = "Terminal" },
			{ "<leader>w", group = "Window" },
			{ "<leader>wR", group = "Reverse" },
			{ "<leader>wf", group = "Files" },
			{ "<leader>wh", group = "Left" },
			{ "<leader>wj", group = "Down" },
			{ "<leader>wk", group = "Up" },
			{ "<leader>wl", group = "Right" },
			{ "<leader>wp", group = "Previous" },
			{ "<leader>wq", group = "Quit" },
			{ "<leader>wr", group = "Resize" },
			{ "<leader>ws", group = "Split" },
			{ "<leader>wsh", group = "Horizontal" },
			{ "<leader>wsv", group = "Vertical" },
		})
	end,
}
