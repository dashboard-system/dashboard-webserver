// src/routes/uci.ts
import { Router, Request, Response } from 'express'
import { UCIManager } from '../utils/uci'
import { UCICreateRequest, UCIUpdateRequest, UCIResponse } from '../shared/types/uci'
import { authenticateToken } from '../middleware/auth'

const router = Router()
const uciManager = new UCIManager()

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Create new section
router.post('/files/:fileName/:sectionType', async (req: Request, res: Response) => {
  try {
    const { fileName, sectionType } = req.params
    const { name, values }: UCICreateRequest = req.body
    
    const uuid = await uciManager.createSection(fileName, sectionType, name, values)
    
    const response: UCIResponse = {
      success: true,
      message: 'Section created successfully',
      data: { uuid }
    }
    res.status(201).json(response)
  } catch (error) {
    console.error(`Error creating section in ${req.params.fileName}:`, error)
    res.status(500).json({
      success: false,
      message: 'Failed to create section'
    })
  }
})

// Update existing section
router.put('/files/:fileName/:sectionType/:uuid', async (req: Request, res: Response) => {
  try {
    const { fileName, sectionType, uuid } = req.params
    const { values }: UCIUpdateRequest = req.body
    
    if (!values) {
      res.status(400).json({
        success: false,
        message: 'Values are required for update'
      })
      return
    }

    await uciManager.updateSection(fileName, sectionType, uuid, values)
    
    const response: UCIResponse = {
      success: true,
      message: 'Section updated successfully'
    }
    res.json(response)
  } catch (error) {
    console.error(`Error updating section ${req.params.uuid}:`, error)
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        message: error.message
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update section on MQTT server'
      })
    }
  }
})

// Delete section
router.delete('/files/:fileName/:sectionType/:uuid', async (req: Request, res: Response) => {
  try {
    const { fileName, sectionType, uuid } = req.params
    
    await uciManager.deleteSection(fileName, sectionType, uuid)
    
    const response: UCIResponse = {
      success: true,
      message: 'Section deleted successfully'
    }
    res.json(response)
  } catch (error) {
    console.error(`Error deleting section ${req.params.uuid}:`, error)
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        message: error.message
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete section on MQTT server'
      })
    }
  }
})

export default router