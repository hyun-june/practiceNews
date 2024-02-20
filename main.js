const API_KEY = '7193a00c8b994a8da934dcf151157b84';
let news =[];
const getlatestNews = async() => {
    const url = new URL(`https://praticenews.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`);

    const response = await fetch(url);
    const data = await response.json();
    news = data.articles
    console.log("ddd", news);
};

getlatestNews();
