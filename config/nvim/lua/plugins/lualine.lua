return {
	"nvim-lualine/lualine.nvim",
	dependencies = { "nvim-tree/nvim-web-devicons" },
	config = function()
		local hydra = require("hydra.statusline")
		require("lualine").setup({
			options = {
				theme = "onedark",
				component_separators = { left = "", right = "" },
				section_separators = { left = "", right = "" },
			},
			sections = {
				lualine_a = {
					{
						function()
							if vim.g.customModeName then
								return vim.g.customModeName
							elseif hydra.is_active() then
								return hydra.get_name()
							else
								return require("lualine.utils.mode").get_mode()
							end
						end,
					},
				},
				lualine_b = { "branch", "diff", "diagnostics" },
				lualine_c = { "filename" },
				lualine_x = {
					function()
						return require("screenkey").get_keys()
					end,
					"encoding",
					"fileformat",
					"filetype",
				},
				lualine_y = { "searchcount" },
				lualine_z = { "location", "progress" },
			},
		})
	end,
}
