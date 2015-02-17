/**
 * Created by Gary A. Stafford on 1/29/15.
 * https://github.com/garystafford/cd-maturity-model
 */

/*properties
 app, averageTitle, axis, categories, category10, colorScale, definition,
 emptyDataSet, idAverageCategories, legendTitle, maturityData, maturityLevels,
 pageTitle, referenceLinkTitle_1, referenceLink_1, scale, score, value
 */

/*global dataModule: true, d3 */
var dataModule = (function () {
    'use strict';

    var categories,
        maturityLevels;

    /*categories = [
        'Build Management and Continuous Integration',
        'Environments and Deployment',
        'Release Management and Compliance',
        'Testing',
        'Data Management',
        'Configuration Management'
    ];*/
    categories = [
        'Culture and Organization',
        'Design and Architecture',
        'Build and Deploy',
        'Test and Verification',
        'Information and Reporting'
    ];


    maturityLevels = [{
        score: -1,
        definition: 'Base'
    }, {
        score: 0,
        definition: 'Begineer'
    }, {
        score: 1,
        definition: 'Intermediate'
    }, {
        score: 2,
        definition: 'Advanced'
    }, {
        score: 3,
        definition: 'Expert'
    }];

    return {
        pageTitle: 'CD Maturity Gap Analysis: Multunus',
        legendTitle: 'Products',
        averageTitle: 'Average Maturity - All Systems',
        idAverageCategories: 100,
        colorScale: d3.scale.category10(),
        referenceLink_1: 'http://en.wikipedia.org/wiki/Continuous_delivery',
        referenceLinkTitle_1: 'Sample Link to Analysis Details',

        maturityLevels: maturityLevels,
        categories: categories,

        emptyDataSet: [
            [{
                'app': '',
                'axis': categories[0],
                value: -1
            }, {
                'app': '',
                'axis': categories[1],
                value: -1
            }, {
                'app': '',
                'axis': categories[2],
                value: -1
            }, {
                'app': '',
                'axis': categories[3],
                value: -1
            }, {
                'app': '',
                'axis': categories[4],
                value: -1
            }]
        ],

        maturityData: [
            [{
                'app': 'bidPress',
                'axis': categories[0],
                'value': 0
            }, {
                'app': 'bidPress',
                'axis': categories[1],
                'value': 2
            }, {
                'app': 'bidPress',
                'axis': categories[2],
                'value': 2
            }, {
                'app': 'bidPress',
                'axis': categories[3],
                'value': 1
            }, {
                'app': 'bidPress',
                'axis': categories[4],
                'value': 1
            }],
            [{
                'app': 'eyzUp',
                'axis': categories[0],
                'value': 0
            }, {
                'app': 'eyzUp',
                'axis': categories[1],
                'value': 2
            }, {
                'app': 'eyzUp',
                'axis': categories[2],
                'value': 1
            }, {
                'app': 'eyzUp',
                'axis': categories[3],
                'value': 1
            }, {
                'app': 'eyzUp',
                'axis': categories[4],
                'value': 1
            }]        
        ]
    };
}());
