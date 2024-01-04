import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  Select,
  message,
} from "antd";
import { API_URL } from "../../common/constants";
import moment from "moment";
import { useAuth } from "@/contexts/AuthContext";
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { UploadChangeParam } from 'antd/lib/upload';

// Define the structure of the form data
interface IEventFormData {
  description: string;
  quantity: number;
  expTime: moment.Moment;
  tag: number;
  photos: string[];
}

const { Option } = Select;

const CreateEventPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { authState } = useAuth();
  const [tags, setTags] = useState<any[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    // Fetch tags from the backend when the component mounts
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tags`, {
          headers: {
            Authorization: `Bearer ${authState?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }

        const data = await response.json();

        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
        // Handle error (show message to the user, etc.)
      }
    };
    fetchTags();
  }, [authState?.token]); // Empty dependency array ensures that the effect runs only once, similar to componentDidMount

  const onFileChange = ({ fileList: newFileList }: UploadChangeParam<UploadFile>) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: UploadFile, currentFileList: UploadFile<any>[]) => {
    // If the updated file list is greater than 10, file cannot be uploaded
    if (currentFileList.length > 10) {
      message.error('You can only upload a maximum of 10 photos.');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const onFinish = async (values: IEventFormData) => {
    const photosAsBase64 = await Promise.all(
      fileList.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject('Could not read file');
            }
          };
          reader.onerror = () => reject('Error reading file');
          if (file.originFileObj) {
            reader.readAsDataURL(file.originFileObj);
          } else {
            reject('File origin file object not found');
          }
        });
      })
    );

    const formattedValues = {
      description: values.description,
      qty: String(values.quantity),
      exp_time: values.expTime.toISOString(), // Format expiration time as ISO string
      tags: [values.tag], // convert single tag to array
      photos: photosAsBase64,
    };

    try {
      const token = authState?.token;

      // Log the token to the console for inspection
      console.log("Token being sent:", token);
      const response = await fetch(`${API_URL}/api/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState?.token}`,
        },
        body: JSON.stringify(formattedValues),
      });
      console;
      if (!response.ok) {
        // You can throw a new Error with the response statusText or your custom error message
        throw new Error(response.statusText || "Event creation failed");
      }

      message.success("Event created successfully");
      router.push("/events"); // Redirect to the events listing page after creation
    } catch (error) {
      // Using a type guard to check if the error is an instance of Error
      if (error instanceof Error) {
        message.error(error.message || "Failed to create event");
      } else {
        // If the error is not an instance of Error, it might be a string or other type
        message.error("An unexpected error occurred");
      }
    }
    console.log(formattedValues)
  };


  return (
    <div>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: "Please input the quantity!" }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="expTime"
          label="Expiration Time"
          rules={[
            { required: true, message: "Please select the expiration time!" },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="tag"
          label="Tag"
          rules={[{ required: true, message: "Please choose a tag" }]}
        >
          <Select placeholder="Select a tag">
            {tags.map((tag) => (
              <Option key={Number(tag.tag_id)} value={Number(tag.tag_id)}>
                {tag.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Event Photos">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={onFileChange}
            beforeUpload={beforeUpload}
            multiple
          >
            {fileList.length < 10 && (
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            )}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Event
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateEventPage;
