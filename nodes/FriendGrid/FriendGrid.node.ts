import {
    INodePropertyOptions, ILoadOptionsFunctions, IExecuteFunctions
} from 'n8n-workflow';

import axios from 'axios';

const urlGetController = 'http://10.121.144.46:8080/api/orgs/5/workflows/controllers';
const urlGetTaskType = 'http://10.121.144.46:8080/api/orgs/5/workflows/task_types';
const urlGetTask = 'http://10.121.144.46:8080/api/orgs/5/workflows/tasks';
const urlGetTaskParams = 'http://10.121.144.46:8080/api/orgs/5/workflows/tasks';

const urlExecTask = 'http://10.121.144.46:8080/api/orgs/5/workflows/tasks';


let controllers : string[] = []
let types : string[] = []

import {
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class FriendGrid implements INodeType {
    // 将 loadResourceOptions 函数放到 methods.loadOptions 对象内部
    methods = {
        loadOptions: {
            loadControllerOptions: async function loadControllerOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                try {
                    const response = await axios.get(urlGetController);

                    // [ { "name": "Option 1", "value": "option1" }, ... ]
                    console.log("获取选项成功：", response.data);
                    controllers.push(...response.data.map((item: {  name: string, value: string }) => item.value));
                    console.log("控制器选项：", controllers);


                    // 将 API 响应转换为 n8n 选项所需的格式
                    return response.data.map((option: { name: string, value: any }) => ({
                        name: option.name,
                        value: option.value,
                    }));
                } catch (error) {
                    // 处理错误，例如记录错误信息或返回默认选项
                    console.error("获取选项时出错：", error);
                    return [];
                }
            },
            loadTaskTypeOptions: async function loadTaskTypeOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                try {
                    const response = await axios.get(urlGetTaskType);

                    // [ { "name": "Option 1", "value": "option1" }, ... ]
                    console.log("获取选项成功：", response.data);
                    types.push(...response.data.map((item: {  name: string, value: string }) => item.value));


                    // 将 API 响应转换为 n8n 选项所需的格式
                    return response.data.map((option: { name: string, value: any }) => ({
                        name: option.name,
                        value: option.value,
                    }));
                } catch (error) {
                    // 处理错误，例如记录错误信息或返回默认选项
                    console.error("获取选项时出错：", error);
                    return [];
                }
            },
            loadTaskOptions: async function loadTaskOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                try {
                    const controller = this.getNodeParameter('controller', 0) as string;
                    const type = this.getNodeParameter('type', 0) as string;

                    console.log("控制器：", controller);
                    console.log("类型：", type);

                    if (!controller || !type) {
                        return [];
                    }

                    const url = `${urlGetTask}?controller=${controller}&type=${type}`;
                    console.log("请求 URL：", url);
                    const response = await axios.get(url);

                    // [ { "name": "Option 1", "value": "option1" }, ... ]
                    console.log("获取选项成功：", response.data);

                    // 将 API 响应转换为 n8n 选项所需的格式
                    return response.data.map((option: { name: string, value: any }) => ({
                        name: option.name,
                        value: option.value,
                    }));
                } catch (error) {
                    // 处理错误，例如记录错误信息或返回默认选项
                    console.error("获取选项时出错：", error);
                    return [];
                }
            },
        },
    };

    async execute(this: IExecuteFunctions): Promise<any> {
        const items = this.getInputData();
        const resource = this.getNodeParameter('resource', 0) as string;

        // 调用 FriendGrid API 进行数据处理
        const response = await axios.post(`${urlExecTask}/${resource}`, {
            items,
        });

        console.log("FriendGrid API 调用成功：", response.data);

        // 返回处理结果
        return [response.data];
    }

    description: INodeTypeDescription = {
        displayName: 'FriendGrid',
        name: 'friendGrid',
        icon: 'file:friendGrid.svg',
        group: ['transform'],
        version: 1,
        description: 'Consume FriendGrid API',
        defaults: {
            name: 'FriendGrid',
            color: '#1A82e2',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [],
        // 使用函数获取 options 的值
        properties: [
            {
                displayName: 'Controller',
                name: 'controller',
                type: 'options',
                noDataExpression: true,
                typeOptions: {
                    loadOptionsMethod: 'loadControllerOptions',
                },
                default: [],
            },
            {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                noDataExpression: true,
                typeOptions: {
                    loadOptionsMethod: 'loadTaskTypeOptions',
                },
                default: [],
            },
            {
                displayName: 'Task',
                name: 'task',
                type: 'options',
                noDataExpression: true,
                typeOptions: {
                    loadOptionsMethod: 'loadTaskOptions',
                    loadOptionsDependsOn: ['controller', 'type'],
                },
                displayOptions: {
                    show: {
                        controller: [
                            {
                                _cnd: { 
                                    not: ''
                                }
                            }
                        ],
                        type: [
                            {
                                _cnd: { 
                                    not: ''
                                }
                            }
                        ],
                    }
                },
                default: [],
            },
        ],
    };
}