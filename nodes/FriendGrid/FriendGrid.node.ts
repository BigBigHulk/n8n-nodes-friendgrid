import {
    IExecuteFunctions, INodePropertyOptions, ILoadOptionsFunctions
} from 'n8n-workflow';

import axios from 'axios';

import {
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class FriendGrid implements INodeType {
    // 将 loadResourceOptions 函数放到 methods.loadOptions 对象内部
    methods = {
        loadOptions: {
            loadResourceOptions: async function loadResourceOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                try {
                    // 替换为你的实际 API 地址
                    const response = await axios.get('http://10.121.144.46:8000/hello');
                    // 假设 API 返回以下格式的数据：
                    // [ { "name": "Option 1", "value": "option1" }, ... ]
                    console.log("获取选项成功：", response.data);

                    // 将 API 响应转换为 n8n 选项所需的格式
                    return response.data.map((option: { name: string, value: string }) => ({
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
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                typeOptions: {
                    loadOptionsMethod: 'loadResourceOptions',
                },
                default: [],
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        return [[]];
    }
}