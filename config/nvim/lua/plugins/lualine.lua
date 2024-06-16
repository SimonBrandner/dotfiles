return {
    'nvim-lualine/lualine.nvim',
    dependencies = { 'nvim-tree/nvim-web-devicons' },
	config = function()
		require("lualine").setup({
			options = {
				theme = "onedark",
				component_separators = { left = '', right = ''},
				section_separators = { left = '', right = ''},
			},
			sections = {
				lualine_a = {{function ()
					if vim.g.customModeName then
						return vim.g.customModeName
					else
						return require('lualine.utils.mode').get_mode()
					end
				end}},
				lualine_b = {'branch', 'diff', 'diagnostics'},
				lualine_c = {'filename'},
				lualine_x = {'encoding', 'fileformat', 'filetype'},
				lualine_y = {'searchcount'},
				lualine_z = {'location'}
			}
		})
	end
}
