from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from geopy.distance import geodesic

def create_data_model(locations):
    """Cria o modelo de dados para o problema"""
    data = {}
    data['locations'] = locations
    data['num_locations'] = len(locations)
    data['depot'] = 0  # Ponto de partida
    return data

def compute_weighted_distance_matrix(locations):
    """Calcula a matriz de distâncias ponderada pelo peso"""
    distances = {}
    max_weight = max(location['Peso'] for location in locations)  # Encontrar o peso máximo
    for from_counter, from_node in enumerate(locations):
        distances[from_counter] = {}
        for to_counter, to_node in enumerate(locations):
            if from_counter == to_counter:
                distances[from_counter][to_counter] = 0
            else:
                from_coords = (from_node['LAT'], from_node['LONG'])
                to_coords = (to_node['LAT'], to_node['LONG'])
                # Ponderar a distância pelo peso
                weight_factor = (max_weight - to_node['Peso'] + 1) / max_weight
                distances[from_counter][to_counter] = geodesic(from_coords, to_coords).meters * weight_factor
    return distances

def main(locations):
    """Resolve o problema do TSP considerando a prioridade pelo peso"""
    # Criar o modelo de dados
    data = create_data_model(locations)
    
    # Cria o gerenciador de roteamento
    manager = pywrapcp.RoutingIndexManager(data['num_locations'], 1, data['depot'])
    
    # Cria o modelo de roteamento
    routing = pywrapcp.RoutingModel(manager)

    # Cria a matriz de distâncias ponderada pelo peso
    distance_matrix = compute_weighted_distance_matrix(data['locations'])

    def distance_callback(from_index, to_index):
        """Função callback para calcular a distância ponderada"""
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return int(distance_matrix[from_node][to_node])

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Define a função de custo (minimizar distância ponderada)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Solução
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    
    solution = routing.SolveWithParameters(search_parameters)

    if solution:
        index = routing.Start(0)
        plan_output = 'Rota ótima considerando prioridade pelo peso:\n'
        route_distance = 0
        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            plan_output += ' -> Local ID {} (Peso: {})'.format(
                data['locations'][node_index]['ID'], 
                data['locations'][node_index]['Peso']
            )
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(previous_index, index, 0)
        plan_output += '\nDistância total: {} metros\n'.format(route_distance)
        print(plan_output)
    else:
        print('Nenhuma solução encontrada!')

# Exemplo de coordenadas com IDs e Peso
locations = [
    {"ID": 1, "LAT": 40.748817, "LONG": -73.985428, "Peso": 80},
    {"ID": 2, "LAT": 34.052235, "LONG": -118.243683, "Peso": 60},
    {"ID": 3, "LAT": 37.774929, "LONG": -122.419416, "Peso": 90},
    {"ID": 4, "LAT": 51.507351, "LONG": -0.127758, "Peso": 100},
    {"ID": 5, "LAT": 48.856613, "LONG": 2.352222, "Peso": 50},
    {"ID": 6, "LAT": 35.689487, "LONG": 139.691711, "Peso": 30},
    {"ID": 7, "LAT": -33.868820, "LONG": 151.209290, "Peso": 10},
    {"ID": 8, "LAT": -23.550520, "LONG": -46.633308, "Peso": 20},
    {"ID": 9, "LAT": 55.755825, "LONG": 37.617298, "Peso": 70},
    {"ID": 10, "LAT": 19.432608, "LONG": -99.133209, "Peso": 40},
]

main(locations)
