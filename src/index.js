import App from './App'

const app = new App()
app.addEvents()
app.populate('trending/all/day','trending')
app.populate('discover/movie','movies')
app.getScreen(0)
