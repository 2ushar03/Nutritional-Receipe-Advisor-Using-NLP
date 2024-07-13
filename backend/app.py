# from flask import Flask,jsonify
# from flask_cors import CORS

# app=Flask(__name__)
# CORS(app)

# @app.route('/',methods=['GET'])
# def get_data():
#     data={"message":"HI  I am a good boy"}
#     return jsonify(data)

# if __name__=='__main__':
#     app.run(host='0.0.0.0',debug=True)



from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)
CORS(app)

df = pd.read_csv("Indain_Food_Cuisine_Dataset.csv")

# Data preprocessing steps (assuming they are correct)

df['Recipe_Instructions'] = df['Recipe_Instructions'].str.lower()
df['Ingredients_of_Dish'] = df['Ingredients_of_Dish'].str.lower()
df['Diet_Type'] = df['Diet_Type'].str.lower()

# Download NLTK resources if not already downloaded
nltk.download('wordnet')
nltk.download('punkt')
nltk.download('stopwords')

def recommend_food(diet_type, ingredients):
    tokens = word_tokenize(ingredients.lower())
    stop_words = set(stopwords.words('english'))
    lemm = WordNetLemmatizer()
    filtered = [lemm.lemmatize(word) for word in tokens if word not in stop_words]
    filtered_set = set(filtered)

    Diet = df[df['Diet_Type'].str.contains(diet_type)].copy()

    if Diet.empty:
        return []

    similarities = []
    for i in range(Diet.shape[0]):
        temp_tokens = word_tokenize(Diet['Ingredients_of_Dish'].iloc[i])
        temp_filtered = [lemm.lemmatize(word) for word in temp_tokens if word not in stop_words]
        temp_set = set(temp_filtered)
        similarity = len(filtered_set.intersection(temp_set))
        similarities.append(similarity)

    Diet.loc[:, 'similarity'] = similarities
    Diet = Diet.sort_values(by=['similarity', 'Ratings_of_Dish'], ascending=[False, False])
    Diet.drop_duplicates(subset='name_of_Dish', keep='first', inplace=True)
    Diet = Diet.head(5).sort_values(by='Ratings_of_Dish', ascending=False)
    Diet.reset_index(drop=True, inplace=True)

    recommendations = Diet[["name_of_Dish", "Recipe_Instructions", "Ratings_of_Dish"]].to_dict(orient='records')
    return recommendations

@app.route('/recommend', methods=['GET'])
def get_recommendations():
    diet_type = request.args.get('diet_type')
    ingredients = request.args.get('ingredients')

    if not diet_type or not ingredients:
        return jsonify({'error': 'Please provide both diet_type and ingredients parameters.'}), 400

    recommendations = recommend_food(diet_type, ingredients)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
