import random
import os

a = 8
b = 1
c = 6
d = 5
e = 7
f = 8
g = 4
h = 7
i = 9
j = 8
k = 7
l = 6
m = 5
n = 7
o = 8
p = 6

ids = []
infos = []
people = []
places = []
sites = []
events = []

password = None
attempts = []
while password != "8165 7847 9876 5786"
  password = input("Enter Password")
  attempts.append(password)
  if password != "8165 7847 9876 5786"
    print("Your password is incorrect. You hava already guessed:")
    for i in attempts:
       print(i)
print("Password correct welcome")
showdatabase()

def showdatabase():
    print("Betnix Database")
    q1 = input("are you entering a person, website, place, event")
    
    def person():
        image_src = input("Enter Image Src")
        name = input("Enter Name")
        dob = input("Enter Date of Birth")
        bp = input("Enter Birth Place")
        discription = input("Enter Discription")
        danger_person = input("enter danger level")
        info = "name :", name , "image :", image_src, "dob :", dob, "Birthplace :", bp, "Discription :", discription, "id :", id, "danger", danger_person
        id = randint.random(1,9999999999)
        infos.insert(,info)
        ids.insert(,id)
        people.insert(,name)
    def place():
         image_src_place = input("Enter Image Src")
         place_name = input("Enter Name")
         coordinates = input("Enter Coordinates")
         discription_place = input("Enter Discription")
         danger_place = input("enter danger level")
         area = input("enter area sqaured feet or miles")
         place_id = randint.random(1,9999999999)
         info_places = "image :",  image_src_place , "name :", place name, "coordinates :",  coordinates, "Discription :",  discription_place, "id :" place_id, "danger :",  danger_place, "area :", area
        
        places.insert(,info_places)
    def website():
        url = input("")
        title = input("")
        discription = input("")
        site_id = randint.random(1,9999999999)
        danger_site = input("enter danger level")
        info_site = "url :", url, "title :", title, "discription :", discription, "id", site_id, "danger :", danger_site
        sites.insert(,info_site)
    def event():
        name_event = input("Enter name")
        date = input("Enter date")
        discription = input("Enter discription")
        event_id = randint.random(1,9999999999)
        danger_event = input("enter danger level")
        info_event = "name :", name_event, "date :", date, "discription :", discription, "id :", event_id, "danger :", danger_event
        events.insert(,info_event)
        
    if q1 = "person":
        person()
    elif q1 = "website" or "site":
        website()
    elif q1 = "place":
         place()
    elif q1 = "event":
         event()
    elif q1 = "settings"
         settings()
    else:
         print("enter something real")
    
   def settings(): 
      settings_q = input("want to put thing in a - z or reverse order or show names of people, place, event, site or and yeah .")
    
    numberpeople = len(people)
    numberevents = len(events)
    numbersites = len(sites)
    numberplaces = len(places)
    
    if settings_q = "reverse, people":
        people.reverse()
    elif settings_q = "reverse, events":
        events.reverse()
    elif settings_q = "reverse, places":
        places.reverse()
    elif settings_q = "reverse, sites":
        sites.reverse()
    elif settings_q = "sort, events":
        events.sort()
    elif settings_q = "sort, places":
        places.sort()
    elif settings_q = "sort, sites":
        sites.sort()    
    elif settings_q = "sort, people":
        people.sort()
    elif settings_q = "show, events":
        for i in range(numberevents):
            print(events[i])
        print(events[1:numberevents + 1])
    elif settings_q = "show, places":
        for i in range(numberplaces):
            print(places[i])
        print(places[1:numberplaces + 1])
    elif settings_q = "show, sites":
        for i in range(numbersites):
            print(sites[i])
        print(sites[1:numbersites + 1])
    elif settings_q = "show, people":
        for i in range(numberpeople):
            print(people[i])
        print(people[1:numberpeople + 1])
        
    else:
        print("try again refresh the page")
    
    
