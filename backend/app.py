import os
import re
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("LASTFM_API_KEY")
BASE_URL = "http://ws.audioscrobbler.com/2.0/"

def scrape_artist_image(artist_name):
    """
    Função auxiliar que faz Web Scraping na página do Last.fm
    para capturar a imagem de fundo do artista.
    """
    try:
        # Formata o nome do artista para o padrão da URL do Last.fm (ex: Linkin Park -> Linkin+Park)
        formatted_name = artist_name.replace(" ", "+")
        url = f"https://www.last.fm/music/{formatted_name}"
        
        # Define um User-Agent para o Last.fm saber que é uma requisição amigável de navegador
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Procura pela tag da imagem de fundo no cabeçalho da página
            header_div = soup.find("div", class_="header-new-background-image")
            if header_div:
                # O Last.fm costuma colocar a imagem no estilo inline: style="background-image: url(...)"
                style_attr = header_div.get("style", "")
                match = re.search(r'url\((.*?)\)', style_attr)
                if match:
                    image_url = match.group(1).strip("'\"")
                    return image_url
            
            # Fallback caso o layout mude: tenta pegar a imagem de avatar do artista
            avatar_meta = soup.find("meta", property="og:image")
            if avatar_meta:
                return avatar_meta.get("content", "")
                
    except Exception:
        # Se o scraping falhar por rede ou mudança no site, retorna vazio sem quebrar o app
        pass
    return ""

@app.route("/api/albums", methods=["GET"])
def get_albums():
    artist_name = request.args.get("artist")
    
    if not artist_name:
        return jsonify({"error": "Por favor, forneça o nome de um artista"}), 400

    try:
        # === 1. BUSCA OS ÁLBUNS DO ARTISTA ===
        params_albums = {
            "method": "artist.gettopalbums",
            "artist": artist_name,
            "api_key": API_KEY,
            "format": "json",
            "limit": 18
        }
        
        response_albums = requests.get(BASE_URL, params=params_albums)
        data_albums = response_albums.json()

        if "error" in data_albums:
            error_msg = data_albums.get("message", "Erro ao buscar álbuns no Last.fm.")
            return jsonify({"error": error_msg}), 400

        raw_albums = data_albums.get("topalbums", {}).get("album", [])
        
        cleaned_albums = []
        for album in raw_albums:
            images = album.get("image", [])
            image_url = images[-1]["#text"] if images else ""

            cleaned_albums.append({
                "name": album.get("name"),
                "image": image_url,
                "url": album.get("url")
            })

        # === 2. BUSCA A BIOGRAFIA DO ARTISTA ===
        params_info = {
            "method": "artist.getinfo",
            "artist": artist_name,
            "api_key": API_KEY,
            "format": "json"
        }
        
        bio_content = "Biografia não disponível."
        real_artist_name = artist_name

        try:
            response_info = requests.get(BASE_URL, params=params_info)
            data_info = response_info.json()
            
            if "error" not in data_info:
                artist_data = data_info.get("artist", {})
                real_artist_name = artist_data.get("name", artist_name)
                raw_bio = artist_data.get("bio", {}).get("content", bio_content)
                bio_content = re.sub(r'<[^>]+>', '', raw_bio).strip()
        except Exception:
            pass

        # === 3. FAZ O WEB SCRAPING DA FOTO DO ARTISTA ===
        artist_image = scrape_artist_image(real_artist_name)

        # === 4. MONTA O SUPER JSON DE RETORNO ===
        output = {
            "artist": {
                "name": real_artist_name,
                "bio": bio_content,
                "image": artist_image  # <-- Nova chave com a foto raspada do site!
            },
            "albums": cleaned_albums
        }

        return jsonify(output)

    except Exception as e:
        return jsonify({"error": f"Erro interno no servidor: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)