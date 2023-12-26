import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

function getRangeOfStats(follower_count: any) {
    if(follower_count > 50000000) {
        return [
            [1000000, 7000000],
            [25000, 50000],
            [100000,250000],
            [10000000, 20000000],
            [50000, 200000],
            [500000, 1000000],
            [10, 30],
            [5000000, 10000000]
        ]
    } else if(follower_count > 10000000) {
        return [ [200000, 1400000], [5000, 10000], [20000, 50000], [2000000, 4000000], [10000, 40000], [100000, 200000], [10, 30], [1000000, 2000000] ]
    } else if(follower_count > 5000000) {
        return [[300000, 700000], [2500, 5000], [10000, 25000], [1000000, 2000000], [5000, 20000], [50000, 100000], [10, 30], [500000, 1000000] ]
    } else if(follower_count > 2500000) {
        return [[150000, 300000], [30000, 60000], [60000, 150000], [300000, 600000], [15000, 30000], [150000, 300000], [15, 60], [87500, 150000]]
    } else if(follower_count > 1000000) {
        return [[60000, 120000], [12000, 24000], [24000, 60000], [120000, 240000], [6000, 12000], [60000, 120000], [15, 60], [35000, 60000]];
    } else if(follower_count > 500000) {
        return [
            [12000, 24000],
            [2400, 4800],
            [4800, 12000],
            [24000, 48000],
            [1200, 2400],
            [12000, 24000],
            [10, 30],
            [7000, 12000]
        ]
    } else if(follower_count > 300000) {
        return [
            [6000, 12000],
            [1200, 2400],
            [2400, 6000],
            [12000, 24000],
            [600, 1200],
            [6000, 12000],
            [10, 30],
            [3500, 6000]
        ]
    } else if(follower_count > 100000) {
        return [
            [2000, 4000],
            [400, 800],
            [800, 2000],
            [4000, 8000],
            [200, 400],
            [2000, 4000],
            [10, 30],
            [1200, 2000]
        ]
    } else if(follower_count > 50000) {
        return [
            [1000, 2000],
            [200, 400],
            [400, 1000],
            [2000, 4000],
            [100, 200],
            [1000, 2000],
            [10, 30],
            [600, 1000]
        ]
    } else if(follower_count > 25000) {
        return [
            [500, 1000],
            [100, 200],
            [200, 500],
            [1000, 2000],
            [50, 100],
            [500, 1000],
            [10, 30],
            [300, 500]
        ]
    } else if(follower_count > 10000) {
        return [
            [300, 500],
            [60, 120],
            [100, 150],
            [500, 1000],
            [20, 30],
            [300, 500],
            [10, 30],
            [100, 250]
        ]
    } else if(follower_count > 5000) {
        return [
            [150, 250],
            [60, 120],
            [40, 75],
            [300, 500],
            [5, 10],
            [150, 250],
            [10, 30],
            [5, 15]
        ]
    } else if(follower_count > 2500) {
        return [
            [50, 150],
            [40, 80],
            [20, 50],
            [200, 400],
            [2, 5],
            [50, 150],
            [10, 30],
            [3, 7]
        ]
    } else if(follower_count > 1000) {
        return [
            [30, 70],
            [35, 60],
            [10, 30],
            [100, 200],
            [0, 1],
            [30, 70],
            [10, 30],
            [0, 3]
        ]
    } else if(follower_count > 750) {
        return [
            [20, 50],
            [25, 40],
            [5, 15],
            [50, 150],
            [0, 0],
            [20, 50],
            [5, 30],
            [0, 1]
        ]
    } else if(follower_count > 500) {
        return [
            [10, 30],
            [15, 30],
            [2, 8],
            [50, 100],
            [0, 0],
            [10, 25],
            [5, 30],
            [0, 0]
        ]
    } else if(follower_count > 250) {
        return [
            [5, 20],
            [7, 20],
            [0, 5],
            [10, 50],
            [0, 0],
            [6, 20],
            [5, 30],
            [0, 0]
        ]
    } else if(follower_count > 100) {
        return [
            [3, 10],
            [5, 10],
            [0, 2],
            [5, 30],
            [0, 0],
            [3, 10],
            [5, 30],
            [0, 0]
        ]
    } else {
        return [
            [0, 0],
            [0, 0],
            [0, 2],
            [0, 5],
            [0, 0],
            [0, 0],
            [5, 30],
            [0, 0]
        ]
    }
}

function getRandomInt(max: any) {
    return Math.floor(Math.random() * max);
}

function getRandomStat(min: any, max: any) {
    return Math.random() * (max - min) + min;
}

export async function POST(request: any) {
    const body = await request.json(); // 👈
    const actorRunId = body.eventData.actorRunId;
    const url = `https://api.apify.com/v2/actor-runs/${actorRunId}/dataset/items?token=${process.env.APIFY_KEY}`
    const response = await fetch(url);
    const json = await response.json();
    const follower_count = json[0].followersCount;
    console.log(follower_count);
    const ranges = getRangeOfStats(follower_count);
    let stats = [];
    for(let i = 0; i < ranges.length; i++) {
        let range = ranges[i];
        let stat = getRandomStat(range[0], range[1]);
        stats.push(stat);
    }
    const prisma = new PrismaClient();
    await prisma.wraps.updateMany({
        where: {
            email: json[0].userName
        },
        data: {
            stats: stats
    }});
    return NextResponse.json({status: 200})
}