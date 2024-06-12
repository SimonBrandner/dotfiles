return {
	'akinsho/bufferline.nvim',
	version = "*",
	dependencies = 'nvim-tree/nvim-web-devicons',
	config = function ()
		require("bufferline").setup({
			options = {
				offsets = {
					{
            			filetype = "neo-tree",
       		     		text = "File Explorer",
      		      		highlight = "Directory",
   		 				separator = true
  		      		}
   		 		},
				indicator = {
                	style = 'underline'
            	},
				diagnostics = "nvim_lsp",
            	separator_style = "thick"
			}
		})
	end
}

