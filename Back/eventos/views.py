from django.shortcuts import render

# Vista para la página de inicio
def index(request):
    return render(request, 'index.html')
