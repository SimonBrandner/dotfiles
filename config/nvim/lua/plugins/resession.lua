return {
	"stevearc/resession.nvim",
	opts = {},
	config = function()
		local cord = require("cord")
		local resession = require("resession")
		resession.setup()

		-- Open Neotree
		resession.add_hook("post_load", function()
			-- For some reason unknown to me this has to be delayed
			vim.defer_fn(function()
				vim.cmd("Neotree")
				vim.cmd("wincmd l")
				cord.on_dir_changed()
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
					pcall(function()
						resession.load(vim.fn.getcwd())
					end)
				end
			end,
		})

		-- Save session when quitting
		vim.api.nvim_create_autocmd("VimLeavePre", {
			callback = function()
				local cwd = vim.fn.getcwd()
				for _, dir in ipairs({ "/home/simon", "/home/simon/Downloads" }) do
					if cwd == dir then
						return
					end
					if cwd == (dir .. "/") then
						return
					end
				end
				resession.save(cwd)
			end,
		})
	end,
}
