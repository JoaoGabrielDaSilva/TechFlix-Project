import axios from 'axios'

export default class App {
    constructor() {
        //Inicialização de atributos
        this.apikey     = 'dfca496b57994b17cd605b1ed8862140'
        this.imgUrl     = 'https://image.tmdb.org/t/p/w500'
        this.trending   = document.getElementById('trending')
        this.movies     = document.getElementById('movies')
        this.searchMenu = document.getElementById('search')
        this.details    = document.getElementById('details')
    }

    addEvents() {
        const trendingMenu = document.getElementById('trending-button')
        const movieMenu    = document.getElementById('movie-button')
        const input        = document.getElementById('search-input')
        
        trendingMenu.addEventListener('click', () => {
            trendingMenu.classList.add('active') //Muda o active da navbar pra tab atual
            movieMenu.classList.remove('active')
            this.getScreen(0)
        })

        movieMenu.addEventListener('click', () => {
            trendingMenu.classList.remove('active')
            movieMenu.classList.add('active')
            this.getScreen(1)
        })

        //Pesquisa os filmes a cada tecla
        input.addEventListener('keyup', () => {
            if (input.value) {
                this.search(input.value)
            } else {
                this.getScreen(0)
            }
        })
    }

    //Cria cards e adiciona informações à eles
    populate(url, containerName, params = '', sort = true) {
        axios.get(`https://api.themoviedb.org/3/${url}?api_key=${this.apikey}${params}`)
        .then(response => {
            const data = response.data.results
            this.notFound(response.data.total_results) //Exibir mensagem not found

            if (sort) data.sort((a, b) => a.vote_average - b.vote_average).reverse()
            for (let i = 0; i < data.length; i++) {
                const cards = this.createCard(document.getElementById(containerName), data[i])
                this.addInfo(cards, data[i])
            }
        })
        .catch(error => console.log(error))
    }

    //Preenche cards com informação
    addInfo(cards, data) {
        const image = data.poster_path ? `${this.imgUrl}${data.poster_path}`: 'https://i.imgur.com/zYEyJjJ.jpg'

        cards.cardImage.setAttribute('src', `${image}` )
        cards.cardName.innerText = data.original_title || data.original_name
        cards.cardDate.innerText = this.dateHelper(data.release_date || data.first_air_date)
        cards.cardRate.innerText = data.vote_average
    }

    //cria os cards e adiciona à um container passado nos parametros
    createCard(container, data) {
        const card      = document.createElement('div')
        const cardRate  = document.createElement('div')
        const cardImage = document.createElement('img')
        const cardBody  = document.createElement('div')
        const cardName  = document.createElement('h5')
        const cardDate  = document.createElement('h6')
        
        card.classList.add('card')
        cardRate.classList.add('rate')
        cardImage.classList.add('card-img-top')
        cardBody.classList.add('card-body')
        cardName.classList.add('card-title')
        cardDate.classList.add('card-title')
        
        cardBody.appendChild(cardName)
        cardBody.appendChild(cardDate)
        card.appendChild(cardRate)
        card.appendChild(cardImage)
        card.appendChild(cardBody)
        
        this.checkNote(data.vote_average, cardRate)

        //Evento que cria card específico do filme
        card.addEventListener('click', () => {
            this.getScreen(3)
            const container = document.getElementById('card-details')
            container.querySelector('img').setAttribute('src', `${this.imgUrl}${data.poster_path}`)
            container.querySelector('.card-body h5').textContent = `${data.original_title || data.original_name}`
            container.querySelector('h6').textContent = this.dateHelper(data.release_date || data.first_air_date)
            document.getElementById('overview').textContent = `${data.overview}`
        })

        container.appendChild(card)
        
        return {
            cardImage, 
            cardName,
            cardDate,
            cardRate
        }
    }

    //Coloca cor na nota
    checkNote(note, path) {
        if (note >= 7) {
            path.classList.add('positive-rate')
        } else if (note > 4 && note < 7) {
            path.classList.add('medium-rate')
        } else {
            path.classList.add('negative-rate')
        }
    }

    //Converte data para formato "01 de Jan de 2000"
    dateHelper(date) {
        const months = [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
        "Jul", "Ago", "Set", "Out", "Nov", "Dez" ]

        if (!date) return null 

        date = date.split('-')
        let day = date[2]
        let month = parseInt(date[1]).toFixed(0)
        let year = date[0]

        for (let i of months) {
            month = i
        }
        let formatedDate = `(${day} de ${month} de ${year})`
        
        return formatedDate
    }

    search(input) {
        document.getElementById('search').innerHTML = '<h3 id="not-found" class="d-none">Não foi possível encontrar nenhum filme com esse nome :(</h3>';
        if (input) { 
            this.populate('search/movie', 'search', `&query=${encodeURI(input)}`, false)
            this.getScreen(2)      
        } else {
            this.getScreen(0)
        }
    }

    notFound(results){
        if (results === 0) {
            this.searchMenu.innerHTML = '<h3>Desculpe, não foi possível encontrar nenhum filme com esse nome :(</h3>'
        } 
    }

    //Exibe tela escolhida
    getScreen(index) {
        //0 - Trending
        //1 - Movies
        //2 - Search
        //3 - Details
        const screens = [this.trending.classList,
                         this.movies.classList,
                         this.searchMenu.classList,
                         this.details.classList]
                               
        for (let i = 0; i < screens.length; i++) {
            if (i === index) {
                screens[i].remove('d-none')
            } else {
                screens[i].add('d-none')
            }
        }
    }
}


