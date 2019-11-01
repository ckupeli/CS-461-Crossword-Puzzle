from flask import Blueprint, jsonify
from selenium import webdriver
from bs4 import BeautifulSoup
import requests
import math

# Define blueprint
solution = Blueprint('solution', __name__)

# Crawler
  # Get puzzle content
puzzle = []
for _ in range(0, 25):
  puzzle.append('')
driver = webdriver.Safari(executable_path = '/usr/bin/safaridriver')
driver.get('https://www.nytimes.com/crosswords/game/mini')
driver.find_element_by_xpath('//*[@id="root"]/div/div/div[4]/div/main/div[2]/div/div[2]/div[2]/article/div[2]/button').click()
driver.find_element_by_xpath('//*[@id="root"]/div/div/div[4]/div/main/div[2]/div/div/ul/div[2]/li[2]/button').click()
driver.find_element_by_xpath('//*[@id="root"]/div/div/div[4]/div/main/div[2]/div/div/ul/div[2]/li[2]/ul/li[3]').click()
driver.find_element_by_xpath('//*[@id="root"]/div/div[2]/div[2]/article/div[2]/button[2]').click()
driver.find_element_by_xpath('//*[@id="root"]/div/div[2]/div[2]/span').click()
b_soup = BeautifulSoup(driver.page_source, 'html.parser')
for letter in b_soup.find_all('text', {'text-anchor' : 'middle'}):
  puzzle[int(letter.find_previous_sibling('rect').get('id')[8:])] = letter.text
driver.quit()

# Selenium
def solution_crawler():
  # Get solutions
  solutions = {}
  for i in b_soup.find_all('text', {'text-anchor' : 'start'}):
    # Down
    if(int(i.find_previous_sibling('rect').get('id')[8:]) < 5):
      solutions[i.text + 'D'] = ''.join([puzzle[int(i.find_previous_sibling('rect').get('id')[8:])], puzzle[5 + int(i.find_previous_sibling('rect').get('id')[8:])],puzzle[10 + int(i.find_previous_sibling('rect').get('id')[8:])], puzzle[15 + int(i.find_previous_sibling('rect').get('id')[8:])], puzzle[20 + int(i.find_previous_sibling('rect').get('id')[8:])]])
    # For some reason, when you combine these two if-statements, it causes an error
    if(int(i.find_previous_sibling('rect').get('id')[8:]) >= 5):
      if(puzzle[int(i.find_previous_sibling('rect').get('id')[8:]) - 5] == ''):
        temp_i = int(i.find_previous_sibling('rect').get('id')[8:]) % 5
        solutions[i.text + 'D'] = ''.join([puzzle[temp_i], puzzle[5 + temp_i],puzzle[10 + temp_i], puzzle[15 + temp_i], puzzle[20 + temp_i]])
    
    # Across
    temp_i = int(i.find_previous_sibling('rect').get('id')[8:])
    if(int(i.find_previous_sibling('rect').get('id')[8:]) > 0):
      if(puzzle[int(i.find_previous_sibling('rect').get('id')[8:]) - 1] == ''):
        solutions[i.text + 'A'] = ''.join(puzzle[temp_i:math.ceil(temp_i / 5) * 5])
    if(int(i.find_previous_sibling('rect').get('id')[8:]) % 5 == 0):
      if(puzzle[int(i.find_previous_sibling('rect').get('id')[8:])] != ''):
        solutions[i.text + 'A'] = ''.join(puzzle[temp_i:temp_i + 5])
  return puzzle, solutions

def get_new_clue_from_solution(solution):
  # Wordnet
  new_clue = ''
  try:
    html_wordnet = requests.get('http://wordnetweb.princeton.edu/perl/webwn?s=' + solution.lower()).text
    b_soup = BeautifulSoup(html_wordnet, 'html.parser')
    # Get rid of a's, b's, i's
    [x.extract() for x in b_soup.find_all('a')]
    [x.extract() for x in b_soup.find_all('b')]
    [x.extract() for x in b_soup.find_all('i')]
    new_clue_html = b_soup.find('li')
    new_clue = new_clue_html.text
    new_clue = new_clue[:-2]
    i = 1
    for l in new_clue:
      if(l == '('):
        new_clue = new_clue[i].upper() + new_clue[i + 1:]
        break
      i = i + 1
  except:
    # Wordnet does not exist, search for famous people
    try:
      html_famous = requests.get('https://www.famousbirthdays.com/names/' + solution.lower() + '.html').text
      b_soup_famous = BeautifulSoup(html_famous, 'html.parser')
      if(b_soup_famous.find(text = 'Oops!') != None):
        href = b_soup_famous.find('a', {'class' : 'face person-item'}).get('href')
        html_famous_person = requests.get(href).text
        b_soup_famous_person = BeautifulSoup(html_famous_person, 'html.parser')
        [x.replace_with(x.text) for x in b_soup_famous_person.find_all('a')]
        # Replace nonbreak space with regular space
        new_clue = b_soup_famous_person.find('p').text[:-2].replace('\xa0', ' ') # \xa0 is unicode of nonbreak space
    except:
      # Not a famous person, search at lexico
      try:
        html_lexico = requests.get('https://www.lexico.com/en/definition/' + solution.lower()).text
        b_soup_lexico = BeautifulSoup(html_lexico, 'html.parser')
        new_clue = b_soup_lexico.find('span', {'class' : 'ind'}).text[:-1]
      except:  
        new_clue = ''
  return new_clue

# API calls
@solution.route('/get_new_clues')
def get_new_clues():
  new_clues = {}
  _, solutions = solution_crawler()
  for key in solutions:
    new_clues[key] = get_new_clue_from_solution(solutions[key])
  return new_clues

@solution.route('/get_puzzle')
def get_puzzle():
  puzzle = {}
  puzzle_list, _ = solution_crawler()
  for i in range(0, 25):
    puzzle[str(i)] = puzzle_list[i]
  return jsonify(puzzle)