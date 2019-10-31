from flask import Blueprint, jsonify
from bs4 import BeautifulSoup
import requests

# Define blueprint
clue = Blueprint('clue', __name__)

# Initialize crawler components
html = requests.get('https://www.nytimes.com/crosswords/game/mini').text
b_soup = BeautifulSoup(html, 'html.parser')

# Crawler functions
def old_clue_crawler():
  old_clues_across = {} # Empty dictionary
  old_clues_down = {} # Empty dictionary
  for i, (old_clue_label, old_clue) in enumerate(zip(b_soup.find_all('span', {'class' : 'Clue-label--2IdMY'}), b_soup.find_all('span', {'class' : 'Clue-text--3lZl7'}))):
    if(i < 5):
      old_clues_across[old_clue_label.text] = old_clue.text
    else:
      old_clues_down[old_clue_label.text] = old_clue.text
  return old_clues_across, old_clues_down

# API calls
@clue.route('/get_old_clues_across')
def get_old_clues_across():
  across, _ = old_clue_crawler()
  return jsonify(across)

@clue.route('/get_old_clues_down')
def get_old_clues_down():
  _, down = old_clue_crawler()
  return jsonify(down)