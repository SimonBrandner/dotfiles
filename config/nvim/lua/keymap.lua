-- Global
vim.g.mapleader = ' '
vim.keymap.set('n', '<leader>q', ':qa<CR>')

-- Buffers
vim.keymap.set('n', '<leader>bf', ':Telescope buffers<CR>')
vim.keymap.set('n', '<leader>bn', ':bn<CR>')
vim.keymap.set('n', '<leader>bp', ':bp<CR>')
vim.keymap.set('n', '<leader>bq', ':bp<CR> :bd#<CR>')
vim.keymap.set('n', '<leader>bw', ':w<CR>')

-- Windows
vim.keymap.set('n', '<leader>wwq', ':wq<CR>')
vim.keymap.set('n', '<leader>wq', ':q<CR>')
vim.keymap.set('n', '<leader>wh', ':wincmd h<CR>')
vim.keymap.set('n', '<leader>wj', ':wincmd j<CR>')
vim.keymap.set('n', '<leader>wk', ':wincmd k<CR>')
vim.keymap.set('n', '<leader>wl', ':wincmd l<CR>')
vim.keymap.set('n', '<leader>wrh', ':wincmd <<CR>')

-- Terminal
vim.cmd(":tnoremap <Esc> <C-\\><C-n>")
vim.keymap.set('n', '<leader>tt', ':ToggleTerm<CR>')

-- Czech layout
vim.cmd(":map č $")
vim.cmd(":map ž ^")
vim.cmd(":map é 0")
