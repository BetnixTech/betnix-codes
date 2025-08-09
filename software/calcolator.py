A = input("Find, What Perimeter, Prisms volume, Shapes Area or Pyththeorem")

if A = "triangle prism":
    triangleprizm()
elif A = "cone volume":
    conevolume()
elif A = "sphere volume":
    spherevolume()
elif A = "cylinder volume":
    cylindervolume()
elif A = "pyramid volume":
    pyramidvolume()
elif A = "rectangle volume":
     recvolume()
elif A = "cimcumrence":
    cimcumrence()
elif A = "circle area":
     circlearea()
elif A = "trangle area":
    triangle_area()
elif A = "sqaure area" or "regtangle area" or "sqaure perimeter" or "retangle perimeter":
     sqauregtangle()
elif  A = "perimeter":
     perimeter()
elif A = "pyththeorem":
     pyththeorem()
elif A = "fraction to decimal":
     fractodeci()
else:
     print("Enter something real")
      
     
   



def triangleprizm():
    b_prizm = input("Enter B")
    h_prizm = input("Enter H")
    height_prizm = input("Enter Height")
    one_half = 1/2
    P3 = one_half * b_prizm * h_prizm
    VOLUME_Prizm = P3 * height_prizm
    print("Volume is", VOLUME_Prizm)
def conevolume():
    HEIGHT = input("Enter Height")
    RAD = input("Enter Radius")
    ONE_THIRED = 1/3
    RADIUS2 = RAD ** 2
    P1 = 3.14 * RADIUS2
    A1 = ONE_THIRED * P1
    VOLUMECONE = A1 * HEIGHT
    print("The volume is", VOLUMECONE)
def spherevolume():
    RADIUS = input("Enter radius")
    RADIUS_CUBIC = RADIUS ** 3
    P2 = 3.14 * RADIUS_CUBIC
    fourthree = 4 / 3
    VOLUME = fourthree * P2
    print("Volume is", VOLUME , "cubic units")
def cylindervolume():
    pi = 3.14
    RadiusV = input("Enter Radius")
    HeightV = input("Enter height")
    RadiusV_Sqaured = RadiusV ** 2
    RadiusSpi = RadiusV_Sqaured * pi
    VolumeV = RadiusSpi * HeightV
    print(VolumeV, "Cubic Units")
def pyramidvolume():
   B = input("Area of the Base")
   H = input("Height of the pyramid")
   Thired = 1/3
   T = Thired * B
   V = T * H
   print("The volume is", V ,"Cubic Units")

def recvolume():
   l =  input("Enter Length")
   w = input("Enter Width")
   h = input("Enter Height")
   v = l * w * h
   print(v, "Cubic Units")

def cimcumrence():
  q1 = input("find cimcumrence, diameter, or radius")
  if q1 = "cimcumrence":
      rad = input("Enter Radius")
      pi = 3.14
      cim = dia * pi
      dia = rad * 2
      print("The Cimcumrence is", cim , "The Radius is", rad , "and the Diameter is", dia)
   elif q1 = "diameter":
      radi = input("Enter Radius")
      diam = radi * 2
      print("diameter is", diam)
    elif q1 = "radius":
      diame = input("enter diameter")
      radiu = diame / 2
      print("Radius is", radiu)
     else:
       print("enter something real")
def circlearea():
   radius = input("Enter Radius")
   pi = 3.14
   radius_sqaured = radius ** 2
   circle_area = pi * radius_sqaured
   print("circle area is", circle_area)
def triangle_area():
  baset = input("Base")
  heightt = input("Height")
  t_area = 0.5 * baset * heightt
  print("area is", t_area)
def sqauregtangle():
  sr_length = input("Enter Length")
  sr_width = input("Enter Width")
  sr_area = sr_length * sr_width
  sr_peri = sr_length + sr_length + sr_width + sr_width
  print("The Area is", sr_area, "Perimeter is", sr_peri)
def perimeter():
  length_1 = input("Enter Length 1")
  length_2 = input("Enter Length 2")
  length_3 = input("Enter Length 3")
  length_4 = input("Enter Length 4 (if extra length just enter a 0)")
  length_5 = input("Enter Length 5 (if extra length just enter a 0)")
  length_6 = input("Enter Length 6 (if extra length just enter a 0)")
  length_7 = input("Enter Length 7 (if extra length just enter a 0)")
  length_8 = input("Enter Length 8 (if extra length just enter a 0)")
  length_9 = input("Enter Length 9 (if extra length just enter a 0)")
  peri = length_1 + length_2 + length_3 + length_4 + length_5 + length_6 + length_7 + length_8 + length_9
  print("Perimer is", peri)
def pyththeorem():
    q = input("find a, b, or c")
    if q = "a":
        sqaured_b = input("Enter Side b")
        hypo_c = input("Enter Hypotenuse")
        sqaured_a = hypo_c - squared_b
        print("side a is", sqaured_a)
    elif q = "b":
        sqaureda = input("Enter Side a")
        hypoc = input("Enter Hypotenuse")
        sqauredb = hypoc - squareda
        print("side b is", sqauredb)
    elif q = "c":
        side_a = input("side a")
        side_b = input("side b")
        a_sqaured = side_a ** 2
        b_sqaured = side_b ** 2
        c_squared = a_sqaured +  b_sqaured
        hypo = c_sqaured
        print("hyhotenuse is", hypo)
    else:
        print("Enter something real")
def fractodeci():
    fract_q = input("Enter A Fraction")
    decimal = fract_q
    print("it is", decimal)   