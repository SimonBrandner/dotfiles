-- Global
vim.g.mapleader = ' '
vim.keymap.set('n', '<leader>q', ':qa<CR>')

-- Buffers
vim.keymap.set('n', '<leader>bf', ':Telescope buffers<CR>')
vim.keymap.set('n', '<leader>bl', ':bn<CR>')
vim.keymap.set('n', '<leader>bh', ':bp<CR>')
vim.keymap.set('n', '<leader>bq', ':bp<CR> :bd#<CR>')
vim.keymap.set('n', '<leader>bw', ':w<CR>')

-- Windows
vim.keymap.set('n', '<leader>wq', ':q<CR>')
vim.keymap.set('n', '<leader>wsh', ':wincmd s<CR>')
vim.keymap.set('n', '<leader>wsv', ':wincmd v<CR>')
vim.keymap.set('n', '<leader>wh', ':wincmd h<CR>')
vim.keymap.set('n', '<leader>wj', ':wincmd j<CR>')
vim.keymap.set('n', '<leader>wk', ':wincmd k<CR>')
vim.keymap.set('n', '<leader>wl', ':wincmd l<CR>')
vim.keymap.set('n', '<leader>wr', ':lua require("resize-mode").start()<CR>')

-- Terminal
vim.cmd(":tnoremap <Esc> <C-\\><C-n>")
vim.keymap.set('n', '<leader>t', ':ToggleTerm<CR>')

-- LSP
vim.keymap.set('n', '<leader>ld', '<cmd>lua vim.lsp.buf.hover()<CR>')
vim.keymap.set('n', '<leader>lr', '<cmd>lua vim.lsp.buf.rename()<CR>')
vim.keymap.set('n', '<leader>la', '<cmd>lua vim.lsp.buf.code_action()<CR>')
vim.keymap.set('n', '<leader>ld', '<cmd>lua vim.lsp.buf.definition()<CR>')
vim.keymap.set('n', '<leader>fg', '<cmd>lua require("telescope.builtin").live_grep()<CR>')
vim.keymap.set('n', '<leader>lu', '<cmd>lua require("telescope.builtin").lsp_references()<CR>')
vim.keymap.set('n', '<C-k>', '<cmd> lua require("telescope.builtin").find_files()<CR>')

-- Text manipulation
vim.keymap.set('n', '<leader>tct', ':%retab!<CR>')
vim.keymap.set('n', '<C-n>', ':MCunderCursor<CR>')

-- GIT
vim.keymap.set('n', '<leader>g', "<cmd>LazyGit<CR>")

-- Czech layout
vim.cmd(":map ; `")
vim.cmd(":map + !")
vim.cmd(":map ě @")
vim.cmd(":map š #")
vim.cmd(":map č $")
vim.cmd(":map ř %")
vim.cmd(":map ž ^")
vim.cmd(":map ý &")
vim.cmd(":map á *")
vim.cmd(":map í {")
vim.cmd(":map é }")
