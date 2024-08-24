from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from geopy.distance import geodesic

class WeightedTSP:
    def __init__(self, locations):
        self.locations = locations
        self.data = self.create_data_model()

    def create_data_model(self):
        """Cria o modelo de dados para o problema"""
        data = {}
        data['locations'] = self.locations
        data['num_locations'] = len(self.locations)
        data['depot'] = 0  # Ponto de partida
        return data

    def compute_weighted_distance_matrix(self):
        """Calcula a matriz de distâncias ponderada pelo peso"""
        distances = {}
        max_weight = max(location['Peso'] for location in self.locations)  # Encontrar o peso máximo
        for from_counter, from_node in enumerate(self.locations):
            distances[from_counter] = {}
            for to_counter, to_node in enumerate(self.locations):
                if from_counter == to_counter:
                    distances[from_counter][to_counter] = 0
                else:
                    from_coords = (from_node['LAT'], from_node['LONG'])
                    to_coords = (to_node['LAT'], to_node['LONG'])
                    # Ponderar a distância pelo peso
                    weight_factor = (max_weight - to_node['Peso'] + 1) / max_weight
                    distances[from_counter][to_counter] = geodesic(from_coords, to_coords).meters * weight_factor
        return distances

    def solve(self):
        """Resolve o problema do TSP considerando a prioridade pelo peso"""
        # Criar o modelo de dados
        data = self.data
        
        # Cria o gerenciador de roteamento
        manager = pywrapcp.RoutingIndexManager(data['num_locations'], 1, data['depot'])
        
        # Cria o modelo de roteamento
        routing = pywrapcp.RoutingModel(manager)

        # Cria a matriz de distâncias ponderada pelo peso
        distance_matrix = self.compute_weighted_distance_matrix()

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
            return plan_output
        else:
            return 'Nenhuma solução encontrada!'
