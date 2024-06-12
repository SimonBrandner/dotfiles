vim.g.mapleader = ' '

-- Buffers
vim.keymap.set('n', '<leader>bn', ':bn<CR>')
vim.keymap.set('n', '<leader>bp', ':bp<CR>')
vim.keymap.set('n', '<leader>b', ':Telescope buffers<CR>')

vim.keymap.set('n', '<leader>q', ':bp<CR> :bd#<CR>')
vim.keymap.set('n', '<leader>qq', ':qa<CR>')
vim.keymap.set('n', '<leader>wq', ':wq<CR>')
vim.keymap.set('n', '<leader>fw', ':w<CR>')

-- Windows
vim.keymap.set('n', '<leader>wq', ':q<CR>')
vim.keymap.set('n', '<leader>wh', ':wincmd h<CR>')
vim.keymap.set('n', '<leader>wj', ':wincmd j<CR>')
vim.keymap.set('n', '<leader>wk', ':wincmd k<CR>')
vim.keymap.set('n', '<leader>wl', ':wincmd l<CR>')
vim.keymap.set('n', '<leader>wrh', ':wincmd <<CR>')

-- Terminal
vim.cmd(":tnoremap <Esc> <C-\\><C-n>")

-- Czech layout
vim.cmd(":map č $")
vim.cmd(":map ž ^")
vim.cmd(":map é 0")
