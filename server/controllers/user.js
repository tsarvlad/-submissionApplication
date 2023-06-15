import User from '../models/User.js'
import { dataSphere } from '../translator.js';

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: 'User not found!' })
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export const getTrack = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: 'User not found!' })
        } else {
            let data = user?.timeMarks?.data
            let length = data.length
            let lastDate = user?.timeMarks?.data[length - 1]?.date
            let nowTime = new Date()
            let differenceS = Math.floor(Math.abs(lastDate.getTime() - nowTime.getTime())) / 1000
            let differenceD = Math.round(differenceS / 60 / 60 / 24)
            res.status(200).json({
                data,
                differenceS,
                differenceD,
                lastDate,
                nowTime
            })

            // user.timeMarks.data = dataSphere
            // user.markModified('timeMarks')
            // await user.save()
            // res.status(200).json({ message: "Virus successfully injected" })
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export const patchTrack = async (req, res) => {
    try {
        const newSubmitionBoilerplate = (user, condition = 'true') => {
            let length = user?.timeMarks?.data.length
            let lastDate = user?.timeMarks?.data[length - 1]?.date
            let nowTime = new Date()

            lastDate.setHours(2, 0, 0, 0)
            nowTime.setHours(2, 0, 0, 0)

            let differenceS = Math.floor(Math.abs(lastDate.getTime() - nowTime.getTime())) / 1000
            let differenceD = Math.round(differenceS / 60 / 60 / 24)
            return {
                "days": differenceD,
                "date": nowTime,
                "condition": condition
            }
        }
        const { condition } = req.body
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: "User not found!" })
            return
        }
        let userTimeMarksUpdated = user.timeMarks
        let newSubmition = newSubmitionBoilerplate(user, condition)
        userTimeMarksUpdated.data.push(newSubmition)
        user.timeMarks = userTimeMarksUpdated
        user.markModified('timeMarks')
        await user.save()
        res.status(200).json({ message: 'Submitted Successfully!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const getUserDashboardInfo = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: 'User not found!' })
            return
        }
        const userData = user.timeMarks.data
        const formattedDates = [];
        const formattedDays = [];

        let isNotFirstIteration = false
        for (let submission of userData) {
            if (isNotFirstIteration) {
                let RANGEBETWEENDAYS = Array.from(Array(submission.days).keys()).map(x => x + 1)
                for (let curRange of RANGEBETWEENDAYS) {
                    formattedDates.push('')
                    formattedDays.push(null)
                }
            }
            formattedDates.push(submission.date.toLocaleDateString('en-US'))
            formattedDays.push(submission.days)
            isNotFirstIteration = true
        }
        //spacing after the last Data point
        const spacing = 5
        for (let i = 0; i < spacing; i++) {
            formattedDates.push('')
        }
        res.status(200).json({ formattedDates, formattedDays })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const RANGE28_50 = Array.from(Array(22 + 1).keys()).map(x => x + 28)
const RANGE21_27 = Array.from(Array(7).keys()).map(x => x + 21)
const RANGE14_20 = Array.from(Array(7).keys()).map(x => x + 14)
const RANGE7_13 = Array.from(Array(7).keys()).map(x => x + 7)
const RANGE0_6 = Array.from(Array(7).keys())

export const getUserAboutInfo = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: "User not found!" })
            return
        }
        const data = user.timeMarks.data

        let trueTimes = 0
        let falseTimes = 0

        let trueDays = 0
        let falseDays = 0

        let categoryClassTimes = {
            week: 0,
            twoWeeks: 0,
            threeWeeks: 0,
            fourWeeks: 0,
            more: 0
        }
        let categoryClassDays = {
            week: 0,
            twoWeeks: 0,
            threeWeeks: 0,
            fourWeeks: 0,
            more: 0
        }

        for (let submission of data) {
            // true/false Times
            submission.condition
                ? trueTimes++
                : falseTimes++
            // true/false Days
            submission.condition
                ? trueDays += submission.days
                : falseDays += submission.days
            //categoryClass
            switch (true) {
                case RANGE28_50.includes(submission.days):
                    categoryClassTimes.more += 1
                    categoryClassDays.more += submission.days
                    continue
                case RANGE21_27.includes(submission.days):
                    categoryClassTimes.fourWeeks += 1
                    categoryClassDays.fourWeeks += submission.days
                    continue
                case RANGE14_20.includes(submission.days):
                    categoryClassTimes.threeWeeks += 1
                    categoryClassDays.threeWeeks += submission.days
                    continue
                case RANGE7_13.includes(submission.days):
                    categoryClassTimes.twoWeeks += 1
                    categoryClassDays.twoWeeks += submission.days
                    continue
                case RANGE0_6.includes(submission.days):
                    categoryClassTimes.week += 1
                    categoryClassDays.week += submission.days
                    continue
                default:
                    continue
            }
        }

        res.status(200).json({ trueTimes, falseTimes, trueDays, falseDays, categoryClassTimes, categoryClassDays })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const addLastSubmission = async (req, res) => {
    try {
        const newSubmitionBoilerplate = (user, date, condition = 'true') => {
            let length = user?.timeMarks?.data.length
            let lastDate = user?.timeMarks?.data[length - 1]?.date
            let nowTime = new Date(date)

            lastDate.setHours(2, 0, 0, 0)
            nowTime.setHours(2, 0, 0, 0)

            let differenceS = Math.floor(Math.abs(nowTime.getTime() - lastDate.getTime())) / 1000
            let differenceD = Math.round(differenceS / 60 / 60 / 24)
            return {
                "days": differenceD,
                "date": nowTime,
                "condition": condition
            }
        }
        const { date, condition } = req.body
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: "User not found!" })
            return
        }
        let userTimeMarksUpdated = user.timeMarks
        let newSubmition = newSubmitionBoilerplate(user, date, condition)
        userTimeMarksUpdated.data.push(newSubmition)
        user.timeMarks = userTimeMarksUpdated
        user.markModified('timeMarks')
        await user.save()
        res.status(200).json(
            { message: 'Submitted Successfully!' }
        )
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteLastSubmission = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: "User not found!" })
            return
        }
        let data = user.timeMarks.data
        const newData = data.slice(0, data.length - 1)

        user.timeMarks.data = newData
        user.markModified('timeMarks')
        await user.save()
        res.status(200).json({ message: "Deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}