from flask import Blueprint, jsonify
from bs4 import BeautifulSoup
import requests

# Define blueprint
cell = Blueprint('cell', __name__)

# Initialize crawler components
html = requests.get('https://www.nytimes.com/crosswords/game/mini').text
b_soup = BeautifulSoup(html, 'html.parser')

# Crawler functions
def cell_type_crawler():
  blocked_cells = []
  for blocked_cell in b_soup.find_all('rect', {'class' : 'Cell-block--1oNaD'}):
    blocked_cells.append(int(blocked_cell.get('id')[8:]))
  return blocked_cells

def cell_number_crawler():
  cell_numbers = []
  for cell_text_anchor in b_soup.find_all('text', {'text-anchor' : 'start'}):
    cell_number = cell_text_anchor.find_previous_sibling('rect').get('id')[8:]
    cell_numbers.append(int(cell_number))
  return cell_numbers

# API calls
@cell.route('/get_cell_types')
def get_cell_types():
  cell_types = dict(enumerate(['Cell'] * 25))
  for i in cell_type_crawler():
    cell_types[i] = 'Block'
  return jsonify(cell_types)

@cell.route('/get_cell_numbers')
def get_cell_numbers():
  cell_numbers = cell_number_crawler()
  return jsonify(cell_numbers)