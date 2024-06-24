return {
	"stevearc/resession.nvim",
	opts = {},
	config = function()
		local resession = require("resession")
		resession.setup()

		-- Open Neotree
		resession.add_hook("post_load", function()
			-- For some reason unknown to me this has to be delayed
			vim.defer_fn(function()
				vim.cmd("Neotree")
				vim.cmd("wincmd l")
			end, 50)
		end)

		-- Open existing session or menu
		vim.api.nvim_create_autocmd("VimEnter", {
			callback = function()
				if vim.fn.argc(-1) == 0 then
					vim.defer_fn(function()
						vim.cmd("Telescope resession")
					end, 50)
				else
					resession.load(vim.fn.getcwd())
				end
			end,
		})

		-- Save session when quitting
		vim.api.nvim_create_autocmd("VimLeavePre", {
			callback = function()
				resession.save(vim.fn.getcwd())
			end,
		})
	end,
}
