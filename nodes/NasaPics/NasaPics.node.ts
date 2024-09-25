import { INodeType, INodeTypeDescription, IExecuteFunctions} from 'n8n-workflow';

export class NasaPics implements INodeType {
    description: INodeTypeDescription = {
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Astronomy Picture of the Day',
                        value: 'astronomyPictureOfTheDay',
                    },
                    {
                        name: 'Mars Rover Photos',
                        value: 'marsRoverPhotos',
                    },
                ],
                default: 'astronomyPictureOfTheDay',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'astronomyPictureOfTheDay',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Get',
                        value: 'get',
                        action: 'Get the APOD',
                        description: 'Get the Astronomy Picture of the day1',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/hello',
                            },
                        },
                    },
                ],
                default: 'get',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'marsRoverPhotos',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Get',
                        value: 'get',
                        action: 'Get the APOD',
                        description: 'Get the Astronomy Picture of the day2',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '',
                            },
                        },
                    },
                ],
                default: 'get',
            },
        ],
        displayName: 'NASA Pics',
        name: 'NasaPics',
        icon: 'file:nasapics.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Get data from NASAs API',
        defaults: {
            name: 'NASA Pics',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
        ],
        requestDefaults: {
            baseURL: 'http://10.121.144.46:8080/api/orgs/5/workflow',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
    };

    async execute(this: IExecuteFunctions): Promise<any> {
    }
}