import { Button, Card, Empty } from 'antd'
import React from 'react'
import Reports from "../../public/images/reports.svg";

function ReportCard() {
  return (
    <div>
                  <Card
            bordered={false}
            style={{ width: 375, height: 426, borderRadius: "0px" }}
          >
            <div className="w-96 text-neutral-400 text-2xl font-normal  leading-loose pl-3">
              Reports
            </div>
            <Empty
              image={Reports}
              imageStyle={{
                height: 187,
                width: 187,
                marginLeft: "96px",
              }}
              description={
                <span>
                  You are currently have no reports to track. You can enroll in
                  course.
                </span>
              }
            >
              <Button
                type="default"
                style={{ color: "white", backgroundColor: "black" }}
              >
                Report an Issue
              </Button>
            </Empty>
          </Card>
    </div>
  )
}

export default ReportCard