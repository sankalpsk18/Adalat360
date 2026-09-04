import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.auditLog.count();
    console.log('Total audit logs:', count);
    
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      select: { 
        id: true, 
        action: true, 
        resourceType: true, 
        resourceId: true,
        caseId: true,
        timestamp: true,
        actor: { select: { name: true, role: true, department: true } }
      }
    });
    console.log('All logs:');
    logs.forEach(log => {
      console.log(`  ${log.action} - ${log.resourceType} (${log.resourceId}) - Case: ${log.caseId} - ${log.actor.name} (${log.actor.department})`);
    });

    // Check what cases exist
    const cases = await prisma.case.findMany({
      select: { id: true, caseNumber: true, department: true }
    });
    console.log('\nCases in database:');
    cases.forEach(c => {
      console.log(`  ${c.caseNumber} (${c.id}) - ${c.department}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
