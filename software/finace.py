ruleinput254 = float(input("Enter amount of money for rule of 25 and 4 percent rule"))
retire = float(input("Enter Retirement account value"))
cash = float(input("Cash/Savings"))
real_estate = float(input("Real Estate (Home)"))
real_estatei = float(input("Real Estate (Income)"))
equity = float(input("business equity"))
auto_car = float(input("Auto/Car"))
other = float(input("other/misc"))

intrestrate = float(input("enter the intrest rate:"))


auto_loan = float(input("Auto/Car Loan"))
morage_loan = float(input("Mortgage/Home Loan"))
esate_loans = float(input("Other real estate/propetry loan"))
credcardebt = float(input("credit card debt"))
car_loan = float(input("car loan"))
student_loan = float(input("student loan"))
other2 = float(input("other/mics"))


loyalties = float(input("loyalties"))
stocks = float(input("stock dividends"))
pbi = float(input("passive business income"))
ri = float(input("rental income"))
inhert = float(input("inheritance"))
gifts = float(input("gifts"))
sr = float(input("Subsidies & Rebates"))

annaul_expense = float(input("annual expenses"))
halfae = annaul_expense / 2

assets = retire + cash + real estate + real estatei + equity + auto_car + other
liabilities = auto_loan + morage_loan + esate_loans + credcardebt + car_loan + student_loan + other2

p4 = (ruleinput254 / 100) * 4
p25 = (ruleinput254 / 100) * 25

net_worth = assets - liabilities
passive_income = loyalties + stocks + pbi + ri + inhert + gifts + sr
leanfire = halfae * 25
fire = annaul_expense * 25

yearsforduoble = 72 / intrestrate 

if annaul_expense > 60000:
    print("your annaul expenses", annaul_expense, "annaul expenses are bigger that average!")
else:
    print("your annaul expenses", annaul_expense, "annaul expenses are less that average!")
   
print("Report:")
print(...)
print("the 4 percent of your retirement money is", p4)
print("the 25 rule for your retirement money is", p25)
print("your net worth is", net_worth)
print("your Leanfire is", leanfire)
print("your fire is", fire)
print("your passive income is", passive_income)
print("its takes", yearsforduoble, "for your money to duoble.")


q = input("dicount finder")


def discount():
    price = float(input("enter normal price"))
    discount = float(input("enter percent"))
    pricewdiscount = price - (price * (discount / 100)) 
    print("price is", pricewdiscount)
    

if q = yes or y or YES or yeah or yas or ok:
    discount()
elif no or nah or n:
    print("refresh the page")
else:
    print("refresh the page")

q2 = input("budget")

def budget():
   budget = []
   index = -1
   number = 0
   for i in range(20)
     item, number + 1 = input("enter a item")
     budget.insert(index + 1, item)
   
   

if q2 = "yes" or "y" or "YES" or "yeah" or "yas" or "ok":
    budget()
elif no or nah or n:
    print("refresh the page")
else:
    print("refresh the page")



